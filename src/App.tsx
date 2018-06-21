import * as React from 'react';
import { Header, Message } from 'semantic-ui-react';
import './App.css';
import AddressView from './AdressView';
import AddressInput from './AddressInput';

interface IState {
    ip: string;
    subnet: string;
    ipError: boolean;
    subnetError: boolean;
}

class App extends React.Component<any, IState> {
    public state: IState = {
        ip: '192.145.96.201',
        subnet: '255.255.255.240',
        ipError: false,
        subnetError: false
    };

    private checkValidSubnetMask(mask = this.state.subnet) {
        const str = this.ipToBinary(mask).replace(/\./g, '');

        return /^1{1,}0{1,}$/.test(str) && str.length == 8 * 4;
    }

    public render() {
        return (
            <div className="App">
                <Header as="h1" className="header">
                    IP-Rechner
                    <Header.Subheader>Tim Specht</Header.Subheader>
                </Header>

                <div className="inputs">
                    <AddressInput
                        defaultValue={this.state.ip}
                        label="IP-Adresse"
                        onChange={ip => this.setState({ ip, ipError: false })}
                        onError={() => this.setState({ ipError: true })}
                    />
                    <AddressInput
                        defaultValue={this.state.subnet}
                        label="Subnetzmaske"
                        onChange={subnet =>
                            this.setState({
                                subnet,
                                subnetError: !this.checkValidSubnetMask(subnet)
                            })
                        }
                        onError={() => this.setState({ subnetError: true })}
                    />
                </div>

                {!this.state.ipError && !this.state.subnetError ? (
                    <div id="view">
                        <AddressView
                            address={this.ipToBinary(this.state.ip)}
                            name="IP-Adresse"
                        />
                        <AddressView
                            address={this.ipToBinary(this.state.subnet)}
                            name="Subnetzmaske"
                        />

                        <AddressView
                            address={this.netzwerkteil()}
                            name="Netzwerkteil"
                        />
                        <AddressView
                            address={this.geraeteteil()}
                            name="Geräteteil"
                        />
                        <AddressView
                            address={this.broadcast()}
                            name="Broadcast"
                        />
                        <AddressView
                            address={this.defaultGateway()}
                            name="Default-Gateway"
                        />
                        <AddressView
                            address={this.biggestIp()}
                            name="Größte IP-Adresse"
                        />
                        <Header as="h1" className="address">
                            {this.numberOfIps()}
                            <Header.Subheader>
                                <div
                                    style={{
                                        fontSize: '1.1em',
                                        fontWeight: 'bold',
                                        marginTop: 2
                                    }}
                                >
                                    Anzahl an IPs
                                </div>
                            </Header.Subheader>
                            <Header.Subheader>Exklusive Gateway und Broadcast</Header.Subheader>
                        </Header>
                    </div>
                ) : (
                    <Message negative>
                        Bitte gib' eine korrekte IP-Adresse und Subnetzmaske
                        ein.
                    </Message>
                )}
            </div>
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

    /*     private toDecimal(binary: string) {
        return parseInt(binary, 2);
    }

    private binaryToIp(binary: string) {
      return binary
          .split('.')
          .map(p => this.toDecimal(p))
          .join('.');
  } */

    private ipToBinary(ip: string) {
        const parts = ip.split('.');
        return parts.map(p => this.toBinary(p)).join('.');
    }

    private invert(binary: string) {
        return binary
            .replace(/0/g, 'x')
            .replace(/1/g, '0')
            .replace(/x/g, '1');
    }

    private and(a: string, b: string) {
        let res = '';
        for (let i = 0; i < a.length; i++) {
            if (a[i] == '.') res += '.';
            else if (a[i] == '1' && b[i] == '1') res += '1';
            else res += '0';
        }
        return res;
    }

    private netzwerkteil() {
        return this.and(
            this.ipToBinary(this.state.ip),
            this.ipToBinary(this.state.subnet)
        );
    }

    private geraeteteil() {
        return this.and(
            this.ipToBinary(this.state.ip),
            this.invert(this.ipToBinary(this.state.subnet))
        );
    }

    private numberOfIps() {
        return (
            2 **
                this.ipToBinary(this.state.subnet)
                    .split('')
                    .reduce<number>((s, c) => {
                        if (c == '0') return s + 1;
                        else return s;
                    }, 0) -
            2
        );
    }

    private broadcast() {
        const invSub = this.invert(this.ipToBinary(this.state.subnet));
        let binIp = this.ipToBinary(this.state.ip).split('');
        for (let i = 0; i < invSub.length; i++) {
            if (invSub[i] == '1') binIp[i] = '1';
        }
        return binIp.join('');
    }

    private defaultGateway() {
        const invSub = this.invert(this.ipToBinary(this.state.subnet));
        let binIp = this.ipToBinary(this.state.ip).split('');

        for (let i = 0; i < invSub.length; i++) {
            if (invSub[i] == '1') binIp[i] = '0';
        }

        binIp[invSub.lastIndexOf('1')] = '1';

        return binIp.join('');
    }

    private biggestIp() {
        const invSub = this.invert(this.ipToBinary(this.state.subnet));
        let binIp = this.ipToBinary(this.state.ip).split('');
        for (let i = 0; i < invSub.length; i++) {
            if (invSub[i] == '1') binIp[i] = '1';
        }

        binIp[invSub.lastIndexOf('1')] = '0';

        return binIp.join('');
    }
}

export default App;
