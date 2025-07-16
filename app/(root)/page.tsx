import ProductList from "@/components/product/product-list";
import sampleData from "@/db/sample-data";

export default function HomePage() {
  return (
    <>
      <ProductList data={sampleData.products} limit={4} title="Newes Arrival"/>
    </>
  );
}
