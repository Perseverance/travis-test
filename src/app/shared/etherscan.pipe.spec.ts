import { EtherscanPipe } from './etherscan.pipe';

describe('EtherscanPipe', () => {
  it('create an instance', () => {
    const pipe = new EtherscanPipe();
    expect(pipe).toBeTruthy();
  });
});
