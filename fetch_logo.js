const https = require('https');

https.get('https://ybox.vn/tuyen-dung/hn-cong-ty-truyen-thong-va-giai-phap-truc-tuyen-leadsgen-tuyen-dung-thuc-tap-sinh-kinh-doanh-full-time-2025-688b3c38585b664fcd2ee84a', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const urls = data.match(/https?:[^\s"'<>]+\.(png|jpg|jpeg|webp|svg)/gi);
    console.log(Array.from(new Set(urls)));
  });
});
