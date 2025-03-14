export default function CarDetailsLoading() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
            <div className="text-zinc-400 mb-48">Loading car details...</div>
        </div>
    );
}