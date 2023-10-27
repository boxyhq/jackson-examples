export default function devLogger(...messages: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...messages);
  }
}
