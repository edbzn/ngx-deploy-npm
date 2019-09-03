let execResolver: (value?: unknown) => void;
let execRejector: (reason?: any) => void;

const exec = jest.fn((command: string) => {
  return new Promise((resolve, reject) => {
    execResolver = resolve;
    execRejector = reject;
  });
});
export default exec;

export function resolve(customStdOut: string) {
  execResolver({
    stdout: customStdOut
  });
}

export function reject(err: string) {
  execRejector(err);
}
