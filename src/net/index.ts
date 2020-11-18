import Eth from './eth';
import Polkadot from './polkadot';

type StartNet = (n: Net) => void;

export default class Net {
  // web3 (metamask) connection
  state: 'loading' | 'connected' | 'failed' = 'loading';
  eth?: Eth;
  polkadot?: Polkadot;

  constructor(start: StartNet) {
    start(this);
  }

  public static async start(): Promise<StartNet> {
    try {
      const eth = new Eth(await Eth.connect());
      const polkadot = new Polkadot(await Polkadot.connect());
      return (net: Net): void => {
        console.log('----- Network started ------');
        net.eth = eth;
        net.polkadot = polkadot;
        net.state = 'connected';
      };
    } catch (err) {
      return (net: Net): void => {
        console.log('----- Network Error ------');
        net.state = 'failed';
      };
    }
  }
}