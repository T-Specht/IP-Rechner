import * as React from 'react';
import { Header } from 'semantic-ui-react';

const Binary: React.StatelessComponent = ({ children }) => {
    return <div style={{ fontFamily: 'monospace' }}>{children}</div>;
};

const AddressView: React.StatelessComponent<{
    address: string;
    name: string;
}> = ({ address, name }) => {
    function binaryToIp(binary: string) {
        return binary
            .split('.')
            .map(p => parseInt(p, 2))
            .join('.');
    }

    return (
        <Header as="h1" className="address">
            {binaryToIp(address)}
            <Header.Subheader>
                <Binary>{address}</Binary>
            </Header.Subheader>
            <Header.Subheader>
                <div
                    style={{
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        marginTop: 2
                    }}
                >
                    {name}
                </div>
            </Header.Subheader>
        </Header>
    );
};

export default AddressView;
