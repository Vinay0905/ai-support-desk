# MySQL User Management 🗄️

As your tutor, I've prepared these SQL commands to help you manage your users. You can run these in your MySQL Workbench or any SQL terminal.

### **1. Creating a New Student**
Use this to add a new student to the system. They will be able to log in and file complaints.

```sql
INSERT INTO users (username, email, password, role) 
VALUES ('student2', 'student2@college.edu', 'password123', 'student');
```

### **2. Creating a New Faculty**
Use this to add an administrator. They will have access to the Faculty Dashboard.

```sql
INSERT INTO users (username, email, password, role) 
VALUES ('prof_smith', 'smith@college.edu', 'admin_pass', 'faculty');
```

### **3. Table Structure Overview**
The `users` table is the gatekeeper of your application. Here is what every column does:
- `id`: Auto-generated unique number.
- `username`: Used for login and display on reports.
- `email`: Secondary identification.
- `password`: Kept simple for this project (Plain text).
- `role`: Must be either `'student'` or `'faculty'`.

---

### **How to check your user list:**
```sql
SELECT id, username, role FROM users;
```
