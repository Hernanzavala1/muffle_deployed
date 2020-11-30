import React from 'react';
import './css/playlist_player.css'

class SimplePlaylistTable extends React.Component{
    constructor(props){
        super(props)
    }

    renderRow(r){
        const cells = [];
        // Object.keys(r).forEach((key) => {
        //     cells.push(this.renderCell(r[key]))
        //    });
        cells.push(this.renderCell(r.title));
        cells.push(this.renderCell(r.artist));
        cells.push(this.renderCell(r.duration));

        if(this.props.isResult == true) {
            return(
                <tr id='playlist-row'>
                    {cells}
                    <div id='row-options'>
                        <i onClick={() => this.props.onAddToPlaylist(r)} className="fas fa-plus-circle" style={{ "paddingRight":"1rem","fontSize": "2rem", "color": "white"}}></i>
                    </div>
                </tr>
            )
        }
        else if(this.props.isResult == false) {
            return(
                <tr id='playlist-row'>
                    {cells}
                    <div id='row-options'>
                        <i onClick={() => this.props.onMoveSongUp(r)} className="fas fa-caret-up" style={{ "paddingRight":"1rem","fontSize": "2rem", "color": "white"}}></i>
                        <i onClick={() => this.props.onMoveSongDown(r)} className="fas fa-caret-down" style={{ "paddingRight":"1rem","fontSize": "2rem", "color": "white"}}></i>
                        <i onClick={() => this.props.onRemoveFromPlaylist(r)} className="fas fa-minus-circle" style={{ "paddingRight":"1rem","fontSize": "2rem", "color": "white"}}></i>
                    </div>
                </tr>
            )
        }
        else {
            return(
                <tr id='playlist-row'>
                    {cells}
                    <div id='row-options'>
                        <i onClick={() => {this.props.updateSong(r.uri); this.props.playSong(r)}} className = "fas fa-play-circle" style={{ "paddingRight":"1rem","fontSize": "2rem", "color": "white", "cursor": "pointer"}}></i>
                    </div>
                </tr>
            )
        }
    }

    renderCell(c){
        return(
            <td className="table-cell">
                {c}
            </td>
        )
    }

    render(){
        return (
            <tbody id="table_content">
                {
                    this.props.playlists.map((r) => this.renderRow(r))
                }
            </tbody>
        )
    }
}
export default SimplePlaylistTable;