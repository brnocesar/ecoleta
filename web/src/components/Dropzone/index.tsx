import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';
import './styles.css';


interface Props {
    onFileUploaded: (file: File) => void;
}

// function Dropzone() {
const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {

    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    
    const onDrop = useCallback(acceptedFiles => {
        
        const imageFile = acceptedFiles[0]; // apenas um arquivo

        const imageFileUrl = URL.createObjectURL(imageFile);

        setSelectedImageUrl(imageFileUrl);
        onFileUploaded(imageFile);
    }, [onFileUploaded])
    
    const {
        getRootProps, 
        getInputProps, 
        isDragActive
    } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (

        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} /* multiple */ accept="image/*" />
                
                { selectedImageUrl ? <img src={selectedImageUrl} alt="Point thumbnail"/> : (
                    <p>
                        <FiUpload />
                        { isDragActive ? "Solte a imagem aqui ..." : "Imagem do estabelecimento" }
                    </p>

                )}
        </div>
    )
}

export default Dropzone;