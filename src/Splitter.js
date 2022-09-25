import JSZip from "jszip";
import FileSaver from "file-saver";
const DEFAULT_SPLIT_INTERVAL = 1000;

function split(data, splitInterval) {
    let portions = [];
    let header = "";
    let lines = data.split(/\r?\n/);
    let portionIndex = 0;
    let headerPassed = false;
    let insideEvent = false;
    let eventEndIndex = 0;
    for(let i = 0; i < lines.length; i++){
        let ln = lines[i];
        if(ln === "BEGIN:VEVENT"){
            insideEvent = true;
            headerPassed = true;
            if(portions[portionIndex] == null){
                portions[portionIndex] = header;
            }
        }
        if(!headerPassed){
            header += ln + "\n";
        }
        if(headerPassed && insideEvent){
            portions[portionIndex] += ln + "\n";
        }
        if(ln === "END:VEVENT"){
            insideEvent = false;
            eventEndIndex += 1;
            if( (eventEndIndex % splitInterval === 0) || (lines[i+1] === "END:VCALENDAR")){
                portions[portionIndex] += "END:VCALENDAR\n";
                portionIndex += 1;
            }
        }
    }
    return portions;
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
export default function splitAndDownload(file, interval=DEFAULT_SPLIT_INTERVAL) {
    let reader = new FileReader();
    reader.readAsText(file);
    try {
        reader.onload = () => {
            let ics = reader.result;
            let portions = split(ics, interval);
            let originalName = file.name.substring(0, file.name.length - 4);
            var zip = new JSZip();
            for(let i = 0; i < portions.length; i++){
                //download(`${originalName}_${i+1}.ics`, portions[i]);
                zip.file(`${originalName}_${i+1}.ics`, portions[i]);
                //zip.file("hello.txt", "hello world!");
            }
            zip.generateAsync({type: 'blob'}).then((content) => {
                FileSaver.saveAs(content, `${originalName}.zip`)
            })
        };
    }
    catch(e) {
        document.write(`Error: ${e}`);
    }
}