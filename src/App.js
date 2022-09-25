import {useState} from 'react'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {Typography, Button, Paper, TextField, Box, Divider} from '@mui/material';
import Splitter from './Splitter'

export default function App() {
    let [file, setFile] = useState(null);
    let [interval, setInterval] = useState(1000);
    function handleUpload(e) {
        setFile(e.target.files[0]);
    }
    function handleIntervalChange(e) {
        setInterval(e.target.value);
    }
    function split() {
        Splitter(file, interval);
    }
    return <Paper variant="outlined" style={{padding:20}}>
        <Typography align="center" variant="h4">Ical Splitter</Typography>
        <Typography variant="body1">
            This tool splits .ics files for you, to allow for easy importing in Google Calendar.
            Nothing is uploaded to the server, so nothing happens to your data(and downloads are instantaneous!).
            Google Calendar imposes a limit of approximately 1000 events per import, so this is the default setting for
            Events per File.
            Outputs a .ZIP containing all portions.
        </Typography>
        <Box pt={1} pb={1}>
        <Divider />
        </Box>
        <Box pt={2} pb={2}>
            <TextField
            sx={{width:"100%"}}
            id="outlined-number"
            label="Events per File"
            type="number"
            defaultValue={"1000"}
            InputLabelProps={{
                shrink: true,
            }}
            onChange={handleIntervalChange}
            />
        </Box>
        <Button sx={{width:"100%"}} variant="contained" component="label" startIcon={<FileUploadIcon />}>
            Upload {file ? `(${file.name})` : null}
            <input hidden accept=".ics" multiple type="file" onChange={handleUpload} />
        </Button>
        <Box pt={1}>
        <Button sx={{width:"100%"}} variant="contained" disabled={file == null} onClick={split}>SPLIT</Button>
        </Box>
    </Paper>
}