import React from 'react';
import './App.css';
import DrawPort from './DrawPort.js';
import * as Dropzone from 'react-dropzone';
import ScrollToTop from 'react-scroll-up';

let topicon = require('./img/top.png');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            main: 'MainApp',
            msg: '',
            dispimg: '',
            boxes: []
        };
    }
    encodeFileUrl(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            let reader = new FileReader();
            reader.onloadend = () => {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    encodeFileObj(file, cb) {
        let reader = new FileReader();
        reader.onloadend = () => {
            cb(reader.result);
        };
        reader.readAsDataURL(file);
    }
    processResponse(people) {
        let boxx = [];
        people.forEach((person) => {
            console.log(person);
            let shadow = {};
            shadow.x = person[0];
            shadow.y = person[1];
            shadow.width = person[2];
            shadow.height = person[3];
            boxx.push(shadow);
        });
        return boxx
    }
    doFetch = (encodedFile) => {
        this.setState({in_process: true, dispimage: encodedFile});
        fetch('http://127.0.0.1:5000', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'img': encodedFile
            })
        }).then(response => {
            response.json().then(resdata => (
                { data: resdata, status: response.status })
            ).then(res => {
                this.setState({msg: 'Response OK'});
                console.log('Server reponse:', res);
                this.setState({
                    boxes: this.processResponse(JSON.parse(res.data.faces)),
                    in_process: null
                });
            }).catch((ex) => {
                this.setState({ msg: ex, in_process: null });
                console.log(ex);
            });
        }).catch((ex) => {
            this.setState({ msg: ex, in_process: null });
            console.log(ex);
        })
    };
    tableClick = (e) => {
        // e.preventDefault();
        if (this.state['in_process']) { return }
        this.setState({ msg: 'Processing...', boxes: [] });
        let imagePath = e.target.src;
        this.encodeFileUrl(imagePath, (asyncResponse) => {
            this.doFetch(asyncResponse);
        });
        // this.scrollElement.click();
    };
    filesDropped(files) {
        if (this.state['in_process']) { return }
        this.setState({ msg: 'Processing...', boxes: [] });
        // TODO: add multiple file handling
        this.encodeFileObj(files[0], (res) => {
            this.doFetch(res)
        })
    }
    render() {
        let dropzoneRef;
        return (
            <div className="App">
                <div>
                    <div className="workingimg">
                        <DrawPort dispimage={this.state.dispimage} boxes={this.state.boxes} />
                    </div>
                    <div>
                        <div className="msgport"><b>SERVER MESSAGE:</b><br /><br />{String(this.state['msg'])}</div>
                    </div>
                        <ScrollToTop showUnder={170}>
                            <span ref={input => this.scrollElement = input}><img width="50" src={topicon} /></span>
                        </ScrollToTop>
                    <div key="sampleImagesTable">
                        <hr />

                        <table><tbody>
                            <tr>
                                <td><img className="sampleimage" src={require('./img/1.jpg')} onClick={this.tableClick} alt="img1" /></td>
                                <td><img className="sampleimage" src={require('./img/2.jpg')} onClick={this.tableClick} alt="img2" /></td>
                            </tr>
                            <tr>
                                <td><img className="sampleimage" src={require('./img/3.jpg')} onClick={this.tableClick} alt="img3" /></td>
                                <td><img className="sampleimage" src={require('./img/4.jpg')} onClick={this.tableClick} alt="img4" /></td>
                            </tr>
                        </tbody></table>
                    </div>
                </div>
                <section>
                    <div>
                        <Dropzone className="filedrop" ref={(node) => { dropzoneRef = node; }} onDropAccepted={(files) => { this.filesDropped(files); }}>
                            <p>Drop files here.</p>
                        </Dropzone>
                        <button type="button" onClick={() => { dropzoneRef.open(); }}>
                            Open File Dialog
                        </button>
                    </div>
                </section>
            </div>
        );
    }
}

export default App;
