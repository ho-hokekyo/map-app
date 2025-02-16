import map from '../../public/map.png';
import FLike from '@mui/icons-material/FavoriteRounded';

import Image from 'next/image';

const Ranking: React.FC = () => {
    return (
        <>
            <div className="text-3xl font-bold text-center">Ranking</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 p-4">
                {Array.from({ length: 100 }).map((_, index) => (
                    <div key={index} className="bg-gray-200 p-2.5">
                        <Image key={index} src={map} alt={`map-${index}`} />
                        <div className="text-center mt-2 text-slate-800">
                            タイトル{index}
                            <div>
                                <FLike className="inline-block ml-1 text-red-500" />
                                {Math.floor(Math.random() * 100)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Ranking;
