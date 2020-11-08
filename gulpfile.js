import { task, src } from 'gulp';
import { create, reporter } from 'gulp-awspublish';
import parallelize from 'concurrent-transform';
import cloudfront from 'gulp-cloudfront-invalidate-aws-publish';

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
task('deploy', function () {
  // S3 オプションを使用して新しい publisher を作成する
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
  const publisher = create(config);
  let g = src(`./${config.distDir}/**`);
  // publisher は、上記で指定した Content-Length、Content-Type、および他のヘッダーを追加する
  // 指定しない場合、はデフォルトで x-amz-acl が public-read に設定される
  g = g.pipe(parallelize(publisher.publish(config.headers), config.concurrentUploads));
  // CDN のキャッシュを削除する
  if (config.distribution) {
    g = g.pipe(cloudfront(config));
  }
  // 削除したファイルを同期する
  if (config.deleteOldVersions) g = g.pipe(publisher.sync());
  // 連続したアップロードを高速化するためにキャッシュファイルを作成する
  g = g.pipe(publisher.cache());
  // アップロードの更新をコンソールに出力する
  g = g.pipe(reporter());
  return g;
});
