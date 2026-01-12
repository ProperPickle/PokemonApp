import './Popup.css';
import {parse} from 'papaparse';
import api from './Api_Interceptor';

const FileInputPopup = () => {
    
    const handleFileChange = async (files: File[]) => {
        for(const file of files) {
            const text = await file.text();
            const result = parse(text, {header: true});
            console.log(result.data);
            const transformedData = result.data.map(row => ({
                lat: parseFloat(row['Lat']),
                long: parseFloat(row['Long']),
                name: row['Pokemon'],
                type: row['Type'],
                loc: row['Location'],
                moves: row['Latest Moves'].replace(/^\[|\]$/g, '').split(/\s*,\s*/).map(move => move.trim()),
                sprite: row['Sprite'],
            }));
            await api.post(`/api/pokemon/`, transformedData, {headers: { "Content-Type": "application/json" }});
        }
    };
    
    return (
        <div className="file-input-window"
        onDragOver={(event) => { event.preventDefault(); console.log('File dragged over');}}
        onDrop={(event) => { 
            event.preventDefault();
            handleFileChange(Array.from(event.dataTransfer.files));
        }}
        >
            <h2>Upload a File</h2>
            <input type="file" onChange={(event) => {
                if(event.target.files) {
                    handleFileChange(Array.from(event.target.files));
                }
            }} />
        </div>
    );
}

export default FileInputPopup;