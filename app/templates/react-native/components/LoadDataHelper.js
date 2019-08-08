import React, { Component } from 'react'
import { StyleSheet, Button, Text } from 'react-native';

export default class extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isLoading: false,
            children: 'Not loaded'
        }
    }

    render() {
        const {
            props: { buttonMessage = 'Load' },
            state: { children }
        } = this;

        return (
            <>
                <Text style={styles.pre}>{children}</Text>
                <Button onPress={this.handleLoadData} title={buttonMessage} />
            </>
        )
    }

    handleLoadData = async () => {
        const wrong = 'Something went wrong';
        let children;

        this.setState({ isLoading: true, children: 'Loading' });

        try {
            children = await this.props.loadDataFunc() || wrong
        } catch (e) {
            console.error(e);
            children = wrong
        }
        this.setState({ isLoading: false, children })
    }
}

const styles = StyleSheet.create({
    pre: {
        backgroundColor: '#ebebeb',
        padding: 16,
        marginVertical: 10,
    }
});