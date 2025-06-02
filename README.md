# 📚 Syllabus Scout

**Syllabus Scout** is a full-stack educational resource discovery platform that allows students to search for high-quality books and videos based on topics. It simplifies learning by matching users with curated study materials while promoting accessible education for all.

![Syllabus Scout Screenshot](https://github.com/user-attachments/assets/8f269ace-3c2b-4559-adaf-adc7692d4113)

---

## 🚀 Features

- **Search Topics**: Find relevant study materials by entering any topic or subject name.
- **Accessible Learning**: Quality content from global sources.
- **Quality Resources**: Curated textbooks and video tutorials.
- **Upload Syllabus (Coming Soon)**: Get tailored book and video recommendations based on your syllabus PDF.
- **Community (Coming Soon)**: Forums and collaborative learning spaces.

---

## 🛠️ Tech Stack

**Frontend**

- React + Vite
- Tailwind CSS
- Framer Motion
- React Icons

**Backend**

- Node.js + Express
- MongoDB (Mongoose)
- Multer (for file upload)
- Open Library API
- YouTube Data API

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PuneethKondarasi/Syllabus-Scout
cd syllabus-scout
```

**Frontend**

```bash
cd client
npm install
```

**Backend**

```bash
cd ../server
npm install
```

---

### 2. Create `.env` file

In `/server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
YOUTUBE_API_KEY=your_youtube_api_key
```

---

### 3. Run the app

**Start backend**

```bash
cd server
npm run dev
```

**Start frontend**

```bash
cd ../client
npm run dev
```

---

### 🧠 Future Enhancements

✅ Community forums and discussion boards  
✅ Bookmark and save materials  
✅ Real-time chat and peer support

### 💌 Connect

Built with ❤️ by Puneeth Kondarasi
[LinkedIn](https://www.linkedin.com/in/puneeth-kondarasi/) • [Portfolio](https://puneethkondarasi.netlify.app/)
