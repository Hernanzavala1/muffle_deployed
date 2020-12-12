import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/friend_result.css'
import './css/playlist_player.css'

class FriendResult extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            result: [],
            friend: null,
            isLoading: true
        }
    }

    componentDidMount() {
        console.log(this.props.location.state.friendName)
        axios.post('/auth/searchFriend', { profileName: this.props.location.state.friendName }).then(res => {
            if (res.data.user == null) {
                this.props.history.push({
                    pathname: '/Network',
                    state: { noFriends: true }
                })
            }
            else {
                console.log(res.data.user)
                var tempA = []
                Object.assign(tempA, this.state.result)
                tempA.push(res.data.user)
                this.setState({ result: tempA, isLoading: false })
            }

        }).catch(err => {
            console.log(err)
        })

        document.getElementById("app").style.height = "calc(100vh - 90px)";
    }

    addFriend(f) {
        var socketId = this.props.location.state.userId + f._id
        var a1 = axios.post('/auth/addFriend', { userId: this.props.location.state.userId, friendId: f._id, socketId: socketId })
        var a2 = axios.post('/auth/addFriend', { userId: f._id, friendId: this.props.location.state.userId, socketId: socketId })
        var tempA = [a1, a2]

         axios.all(tempA).then(axios.spread((...responses) => {
            this.props.history.push({
                pathname: '/Network'
              })
        })).catch(errors => {
            console.log(errors)
        })
    }

    renderRow(r) {
        const cells = [];
        cells.push(this.renderCell(r.profileName));
        cells.push(this.renderCell(r.email));
        
        return (
            <tr id='playlist-row'>
                {cells}
                <div id='row-options'>
                    <i className="fas fa-plus-circle" style={{ "paddingRight": "1rem", "fontSize": "2rem", "color": "white" }} onClick={() => this.addFriend(r) }></i>
                </div>
            </tr>
        )
    }

    renderCell(c) {
        return (
            <td className="table-cell">
                {c}
            </td>
        )
    }


    render() {
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }

        return (
            <div id='friend_result_container' className="container">
                <div className='row justify-content-center'>
                    <div className='col offset-*'>
                        <h1 >People found:</h1>
                        <table scope="col" className="table table-dark table-fixed table-bordered">
                            <thead>
                                <tr>
                                    <th id="column_title" scope="col">Name</th>
                                    <th id="column_title" scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody id="table_content">
                                {
                                    this.state.result.map((r) => this.renderRow(r))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        );
    }

}
export default FriendResult;