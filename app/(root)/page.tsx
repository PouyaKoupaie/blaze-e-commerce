const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default async function HomePage() {
  await delay(1000); // Simulate a delay for loading
  return <div>blaze store</div>;
}
