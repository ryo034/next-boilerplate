/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const awspublish = require('gulp-awspublish');
const parallelize = require('concurrent-transform');
const cloudfront = require('gulp-cloudfront-invalidate-aws-publish');

const config = {
  params: {
    Bucket: process.env.AWS_BUCKET_NAME
  },
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v3'
  },
  deleteOldVersions: false, // PRODUCTION で使用しない
  distribution: process.env.AWS_CLOUDFRONT, // CloudFront distribution ID
  region: process.env.AWS_DEFAULT_REGION,
  headers: {
    'x-amz-acl': 'private'
    /* 'Cache-Control': 'max-age=315360000, no-transform, public', */
  },
  distDir: 'dist',
  indexRootPath: true,
  cacheFileName: '.awspublish',
  concurrentUploads: 10,
  wait: true // CloudFront のキャッシュ削除が完了するまでの時間（約30〜60秒）
};

// eslint-disable-next-line func-names
gulp.task('deploy', function () {
  // S3 オプションを使用して新しい publisher を作成する
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
  const publisher = awspublish.create(config);

  let g = gulp.src(`./${config.distDir}/**`);
  // publisher は、上記で指定した Content-Length、Content-Type、および他のヘッダーを追加する
  // 指定しない場合、はデフォルトで x-amz-acl が public-read に設定される
  g = g.pipe(parallelize(publisher.publish(config.headers), config.concurrentUploads));

  // CDN のキャッシュを削除する
  if (config.distribution) {
    console.log('Configured with CloudFront distribution');
    g = g.pipe(cloudfront(config));
  } else {
    console.log('No CloudFront distribution configured - skipping CDN invalidation');
  }

  // 削除したファイルを同期する
  if (config.deleteOldVersions) {
    g = g.pipe(publisher.sync());
  }
  // 連続したアップロードを高速化するためにキャッシュファイルを作成する
  g = g.pipe(publisher.cache());
  // アップロードの更新をコンソールに出力する
  g = g.pipe(awspublish.reporter());
  return g;
});
