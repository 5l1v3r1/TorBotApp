import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MaterialHome from './materialhome';

let ws;

let id = 0;
function createRow(link, status) {
    id += 1;
    return {id, link, status};
}
class MaterialLinks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {linkStatus: [], home: false};
        this.state.linkStatus.push(createRow('http://www.google.com', 'GOOD'));
        ws = new WebSocket('ws://127.0.0.1:8080/links?url=' + encodeURIComponent(props.url));
        ws.onmessage = this.handleMessage.bind(this); 
        this.onHome = this.onHome.bind(this);
    }

    onHome() {
        this.setState({home: true});
    }

    handleMessage(msg) {
        console.log(msg);    
    }

    render() {
        if (this.state.home) return <MaterialHome/>;
        return (
            <form>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Link</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.linkStatus.map(linkStatus => (
                                <TableRow key={linkStatus.id}>
                                    <TableCell>{linkStatus.link}</TableCell>
                                    <TableCell>{linkStatus.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <br/>
                <Button onClick={this.onHome} variant="contained" color="primary">
                    HOME
                </Button>
            </form>
        );
    }
}

export default MaterialLinks;