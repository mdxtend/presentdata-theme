const Error404 = () => {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-8rem)] box-border">
            <div className='justify-items-center'>
                <h1 className="text-5xl font-serif mb-2">Page Not Found (404)</h1>
                <div className="flex justify-center items-center mt-4">
                    <div className="w-16 h-16 border-4 border-t-4 border-border rounded-full animate-spin border-t-primary-bright"></div>
                </div>
            </div>
        </div>
    );
};

export default Error404;
