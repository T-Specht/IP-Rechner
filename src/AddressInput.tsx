import * as React from 'react';
import { Input } from 'semantic-ui-react';

interface IState {
    address: string;
    error: boolean;
}

interface IProps {
    label: string;
    defaultValue: string;
    onChange?: (ip: string) => any;
    onError?: () => any;
}

export default class AddressInput extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            address: props.defaultValue,
            error: this.checkError(props.defaultValue)
        };
    }

    private checkError(address = this.state.address) {
        const formCheck = /^(\d{1,3}\.){3}\d{1,3}$/.test(address);

        return !(
            formCheck &&
            address.split('.').every(p => {
                const num = parseInt(p);
                return num >= 0 && num <= 255;
            })
        );
    }

    private toBinary(n: string, pad = true) {
        const b = parseInt(n, 10).toString(2);
        if (pad) {
            return b.padStart(8, '0');
        } else {
            return b;
        }
    }

    private ipToBinary(ip: string) {
        const parts = ip.split('.');
        return parts.map(p => this.toBinary(p)).join('.');
    }

    private changeHandler(e: React.SyntheticEvent<HTMLInputElement>) {
        const address = (e.target as HTMLInputElement).value;
        this.setState({
            address,
            error: this.checkError(address)
        });

        if (!this.checkError(address))
            this.props.onChange && this.props.onChange(address);
        else this.props.onError && this.props.onError();
    }

    render() {
        return (
            <div>
                <Input
                    label={this.props.label}
                    type="text"
                    error={this.state.error}
                    value={this.state.address}
                    onChange={this.changeHandler.bind(this)}
                />
                <div className="binary">{this.ipToBinary(this.state.address)}</div>
            </div>
        );
    }
}
