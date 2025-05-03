import StoreDetails from '@/components/customer/store-details';

export default async function StoreDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <StoreDetails storeId={params.id} />;
}
