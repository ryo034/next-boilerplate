// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (_req: any, res: any) => {
  res.statusCode = 200;
  res.json({ name: 'John Doe' });
};
