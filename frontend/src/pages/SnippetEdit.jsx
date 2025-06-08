import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { toast } from 'react-toastify'
import axios from 'axios'

const SnippetEdit = () => {

    const {state}=useLocation()
    const navigate=useNavigate()
    const API_URL= 'http://localhost:8000/api'

    const [formData, setFormData] = useState({
            title: '',
            category: 'CODE',
            content: '',
            link_url: '',
            link_title: '',
            language: 'c',
            file: null,
            is_starred: false,
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(()=>{
        setFormData({
            title: state.snippet.title,
            category: state.snippet.category,
            content: state.snippet.content,
            link_url: state.snippet.link_url,
            link_title: state.snippet.link_title,
            language: state.snippet.language,
            file: null,
            is_starred: state.snippet.is_starred,
        })
    },[state])

    const handleChange = (e) =>{
        const {name, value, type, checked, files} = e.target
        if (type === 'file' && files[0]) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (files[0].size > MAX_FILE_SIZE) {
                toast.error('File size exceeds 5MB limit', { theme: 'colored' });
                return;
            }
            if (!validTypes.includes(files[0].type)) {
                toast.error('Invalid file type. Only PDF, JPG, and PNG are allowed', { theme: 'colored' });
                return;
            }
        }
        setFormData((prev => ({...prev, [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,})))
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if (!formData.title) {
            toast.error('Title is required', { theme: 'colored' });
            return;
        }
        if (formData.category === 'CODE' && !formData.content) {
            toast.error('Code content is required', { theme: 'colored' });
            return;
        }
        if (formData.category === 'LINKS' && (!formData.link_url || !formData.link_title)) {
            toast.error('Link URL and title are required', { theme: 'colored' });
            return;
        }
        if (formData.category === 'NOTES' && !formData.content) {
            toast.error('Note content is required', { theme: 'colored' });
            return;
        }
        if (formData.category === 'FILES' && !formData.file && !state.snippet.file) {
            toast.error('File is required', { theme: 'colored' });
            return;
        }

        setIsSubmitting(true)
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        if (formData.content) data.append('content', formData.content);
        if (formData.link_url) data.append('link_url', formData.link_url);
        if (formData.link_title) data.append('link_title', formData.link_title);
        if (formData.language) data.append('language', formData.language);
        if (formData.file) data.append('file', formData.file);
        data.append('is_starred', formData.is_starred);

        try {
        const response = await axios.patch(`${API_URL}/snippets/${state.snippet.id}/`, data, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        toast.success('Snippet has been edited', { theme: 'colored' });
        setTimeout(() => navigate('/snippet-view', { state: { snippet: response.data } }));
        } catch (error) {
        console.error('Edit snippet error: ', error);
        const errorMessage = error.response?.data?.category
            ? error.response.data.category.join(', ')
            : 'Failed to edit snippet';
        toast.error(errorMessage, { theme: 'colored' });
        } finally {
        setIsSubmitting(false);
        }
    }

    const InputRender = () =>{
        if(formData.category==='CODE'){
            return(
                <div className='px-6'>
                    <label className='font-bold mr-4' htmlFor="language">Choose Language:</label>
                    <select className='mt-2 border-2 rounded-sm' name="language" id="language" value={formData.language} onChange={handleChange}>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                    </select> <br />
                    <textarea className='mt-2 p-2 border-2 rounded-lg w-68 sm:w-135 md:w-175 h-30 border-gray-500' name="content" id="code" value={formData.content} onChange={handleChange} placeholder='Enter your code'></textarea>
                </div>    
            )
        }
        else if(formData.category==='LINKS'){
            return(
                <>
                    <input className='mt-2 mx-6 p-3 sm:w-135 md:w-175 border-2 border-gray-500 rounded-lg' name='link_url' type="url" value={formData.link_url} onChange={handleChange} placeholder='https://example.com'/> <br />
                    <input className='mt-3 mx-6 p-3 sm:w-135 md:w-175 border-2 border-gray-500 rounded-lg' name='link_title' type="text" value={formData.link_title} onChange={handleChange} placeholder='Link title' />
                </>
            )
        }
        else if(formData.category==='NOTES'){
            return(
                <>
                <textarea value={formData.content} onChange={handleChange} className='mx-6 md:w-175 p-2 border-2 h-40 border-gray-500 rounded-lg' name="content" placeholder='Enter snippet content'></textarea>
                </>
            )
        }

        else if(formData.category==='FILES'){
            return(
                <>
                    <div className='px-6'>
                        <input type="file" name='file' className='mt-2' onChange={handleChange} accept='.pdf,.jpg,.jpeg,.png' />
                        {state.snippet.file && (
                            <p>
                                Current file: <a href={state.snippet.file} target="_blank" rel="noopener noreferrer">View file</a>
                            </p>
                        )}
                    </div>
                </>
            )
        }
    }


  return (
    <>
        <NavBar/>
        <div className='flex justify-center bg-gray-300 h-172 xl:h-[calc(100vh)] p-8'>
        <div className='bg-white w-80 sm:w-150 md:w-190 rounded-xl shadow-2xl'>
            <h1 className='font-bold py-6  text-3xl text-center'>Edit Snippet</h1>
            <form onSubmit={handleSubmit}>
            <div>
                <label className='font-bold px-6 text-xl' htmlFor="">Title</label> <br />
                <input className='mx-6 p-3 sm:w-135 md:w-175 border-2 border-gray-500 rounded-lg' type="text" name='title' value={formData.title} onChange={handleChange} placeholder='Enter snippet title' />
            </div>
             <br />

             <div>
                <label className='font-bold text-xl px-6' htmlFor="category">Snippet's Category</label> <br /> 
                <select className='mx-6 p-3 border-2 border-gray-500 w-69 sm:w-135 md:w-175 rounded-lg' name="category" id="category" value={formData.category} onChange={handleChange}>
                    <option value="CODE">Code</option>
                    <option value="LINKS">Links</option>
                    <option value="NOTES">Notes</option>
                    <option value="FILES">Files</option>
                </select>
             </div>
             <br />

             <div>
                <label className='font-bold px-6 text-xl' htmlFor="">Content</label> <br />
                {InputRender()}
             </div>
            
                <div className='flex justify-center mt-6 p-4 gap-7'>
                    <button type='submit' className='bg-green-600 text-white w-50 rounded-lg cursor-pointer p-3 text-sm sm:text-xl hover:bg-green-400'><i className='bx bx-save' style={{color:'#f8f9fc'}} ></i> Save Changes</button>
                    <button onClick={()=> navigate('/snippet-view', {state:{snippet : state.snippet}})} type='button' className='bg-blue-500 text-white w-50 rounded-lg cursor-pointer p-3 text-sm sm:text-xl hover:bg-blue-400'><i className='bx bx-message-square-x'></i> Cancel</button>
                </div>            
            </form>
        </div>
    </div>
    </>
  )
}

export default SnippetEdit