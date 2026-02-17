import CellularView from "@/components/cellular/CellularView";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return <CellularView id={id} />;
}
