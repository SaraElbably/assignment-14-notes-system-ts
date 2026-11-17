export {};

// ------------ #7 generics // storage --------------------

class Storage<T> {
    private items: T[] = [];

    addItem(item: T): void {
        this.items.push(item);
    }

    removeItem(item: T): void {
        this.items = this.items.filter((i) => i !== item);
    }

    getAllItems(): T[] {
        return this.items;
    }
}

// ------------ #1 base class// user ----------------
class User {
    public id: number;
    public name: string;
    public email: string;
    private password: string;     
    protected phone: string;     
    protected age: number;

    // #5  --------- aggregation -----------
    private notebooks: NoteBook[] = [];

    constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
        if (age < 18 || age > 60) {
            throw new Error("Age must be between 18 and 60");
        }
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.age = age;
    }

    displayInfo(): void {
        console.log(`User -> id: ${this.id}, name: ${this.name}, email: ${this.email}, phone: ${this.phone}, age: ${this.age}`);
    }

    addNotebook(notebook: NoteBook): void {
        this.notebooks.push(notebook);
    }

    getNotebooks(): NoteBook[] {
        return this.notebooks;
    }
}

// --------------- #2 inheritance -----------
class Admin extends User {
    // Override: same method name, new behavior
    displayInfo(): void {
        super.displayInfo();
        console.log("Role: Admin");
    }

    manageNotes(notebook: NoteBook, noteId: number): void {
        console.log(`Admin ${this.name} is managing notes...`);
        notebook.removeNote(noteId);
    }
}

// ------------------- #3 Note -----------------
class Note {
    public id: number;
    public title: string;
    public content: string;
    public userId: number;    
    public author: User;       // #6 association 

    constructor(id: number, title: string, content: string, author: User) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.userId = author.id;
    }

    preview(): string {
        return this.content.length > 20 ? this.content.substring(0, 20) + "..." : this.content;
    }
}

// ------------- #4 composition ----------------------

class NoteBook {
    public id: number;
    public name: string;
    private notes: Note[] = [];
    private nextNoteId: number = 1;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    addNote(title: string, content: string, author: User): Note {
        const note = new Note(this.nextNoteId++, title, content, author);
        this.notes.push(note);
        return note;
    }

    removeNote(noteId: number): void {
        this.notes = this.notes.filter((n) => n.id !== noteId);
    }

    getNotes(): Note[] {
        return this.notes;
    }
}

const sara = new User(1, "Sara", "sara@gmail.com", "123456", "01000000000", 25);
const admin = new Admin(2, "Admin", "admin@gmail.com", "admin123", "01111111111", 30);

sara.displayInfo();
admin.displayInfo();

try {
    new User(3, "Kid", "kid@gmail.com", "123", "0100", 15);
} catch (error) {
    console.log("Error:", (error as Error).message);
}

const notebook = new NoteBook(1, "My Notebook");
sara.addNotebook(notebook);

notebook.addNote("First note", "This is the content of my first note, it is long", sara);
notebook.addNote("Second note", "Short note", sara);

notebook.getNotes().forEach((n) => {
    console.log(`Note ${n.id} by ${n.author.name} (userId ${n.userId}): ${n.preview()}`);
});

admin.manageNotes(notebook, 1);
console.log("Notes left:", notebook.getNotes().length);

const numbersStorage = new Storage<number>();
numbersStorage.addItem(10);
numbersStorage.addItem(20);
numbersStorage.removeItem(10);
console.log("Numbers:", numbersStorage.getAllItems());

const usersStorage = new Storage<User>();
usersStorage.addItem(sara);
usersStorage.addItem(admin);
console.log("Users count:", usersStorage.getAllItems().length);
