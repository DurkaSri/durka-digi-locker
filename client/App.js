// Frontend: React.js (App.js)
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/my-files", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setFiles(res.data.files))
        .catch((err) => console.error(err));
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", form);
      alert(res.data.message);
    } catch (err) {
      console.error("Register Error:", err);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: form.email,
        password: form.password,
      });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:5000/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  return (
    <div>
      {!token ? (
        <div>
          <h2>Register</h2>
          <form onSubmit={register}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>
          </form>

          <h2>Login</h2>
          <form onSubmit={login}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Upload File</h2>
          <form onSubmit={uploadFile}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
            <button type="submit">Upload</button>
          </form>

          <h2>My Files</h2>
          <ul>
            {files.map((file) => (
              <li key={file._id}>{file.filename}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
