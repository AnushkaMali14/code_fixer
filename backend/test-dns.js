import dns from 'dns';

const target = '_mongodb._tcp.codefixerscluster.halduut.mongodb.net';

dns.resolveSrv(target, (err, addresses) => {
  if (err) {
    console.error('DNS Resolve failed:', err);
    return;
  }
  console.log('Successfully resolved SRV records:');
  console.log(addresses);
});
