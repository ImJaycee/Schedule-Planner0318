import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import NavbarAdmin from '../../components/NavbarAdmin';

const AdminAnnouncement = () => {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 3;

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/announcements', {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });
      setAnnouncements(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:4000/api/announcements/${editId}`, { title, content, expiresAt }, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        });
        alert('Announcement updated successfully!');
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post('http://localhost:4000/api/announcements', { title, content, expiresAt }, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        });
        alert('Announcement created successfully!');
      }
      setTitle('');
      setContent('');
      setExpiresAt('');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert('Failed to create/update announcement.');
    }
  };

  const handleEdit = (announcement) => {
    setTitle(announcement.title);
    setContent(announcement.content);
    setExpiresAt(new Date(announcement.expiresAt).toISOString().split('T')[0]); // Format date to yyyy-MM-dd
    setIsEditing(true);
    setEditId(announcement._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/announcements/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });
      alert('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert('Failed to delete announcement.');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setExpiresAt('');
    setIsEditing(false);
    setEditId(null);
  };

  const totalPages = Math.ceil(announcements.length / announcementsPerPage);
  const currentAnnouncements = announcements.slice((currentPage - 1) * announcementsPerPage, currentPage * announcementsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="flex-1 p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{isEditing ? 'Update Announcement' : 'Create Announcement'}</h2>
  
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
  
            {/* Content */}
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content</label>
              <textarea
                id="content"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
  
            {/* Expires At */}
            <div className="mb-4">
              <label htmlFor="expiresAt" className="block text-gray-700 text-sm font-bold mb-2">Expires At</label>
              <input
                type="date"
                id="expiresAt"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
  
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button type="submit" className="w-full sm:w-auto p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                {isEditing ? 'Update Announcement' : 'Create Announcement'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancel} className="w-full sm:w-auto p-2 bg-red-500 text-white rounded hover:bg-gray-600">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
  
        {/* Announcements Section */}
        <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg shadow-lg">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Announcements</h2>
            {currentAnnouncements.map((announcement) => {
              const isExpired = new Date(announcement.expiresAt) < new Date();
              return (
                <div key={announcement._id} className="bg-white p-4 mb-4 border rounded-lg shadow">
                  <h3 className="text-lg sm:text-xl font-bold">{announcement.title}</h3>
                  <p className="mb-2 text-sm sm:text-base">{announcement.content}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Expires at: {new Date(announcement.expiresAt).toLocaleDateString()}
                    {isExpired && <span className="text-red-500 ml-2">(Expired)</span>}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {!isExpired && (
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
  
            {/* Pagination */}
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default AdminAnnouncement;