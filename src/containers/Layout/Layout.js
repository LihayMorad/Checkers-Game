import React, { Component } from 'react';

import Header from '../../components/UI Elements/Header/Header';
import Board from '../Board/Board';

class Layout extends Component {

    state = {

    }

    render() {
        return (
            <>
                <Header />
                <Board />
            </>
        );
    }
}

export default Layout;