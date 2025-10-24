import blob from '../assets/blob.svg';
import blob1 from '../assets/blob1.svg';
import blob2 from '../assets/blob2.svg';
import blob3 from '../assets/blob3.svg';

export default function ColorBlobBackground() {
  return (
      <div className="relative w-screen h-screen overflow-hidden bg-amber-50 ">
      <div className="flex justify-center items-center">
        <img src={blob} alt="blob"
          width={600} height={600}
          className="absolute bottom-[12px] right-[100px] animate-blob mix-blend-multiply blur-3xl opacity-80" />
        <img src={blob1} alt="Blob 1"
          width={800} height={500}
          className="absolute bottom-[20px] right-[250px] animate-blob mix-blend-multiply blur-3xl opacity-80" />
        <img src={blob2} alt="Blob 2"
          width={500} height={500}
          className="absolute top-[50px] animate-blob mix-blend-multiply blur-3xl opacity-80" />
        <img src={blob3} alt="blob3"
          width={500} height={500}
          className="absolute top-[50px] animate-blob mix-blend-multiply blur-3xl opacity-80" />
      </div>
    </div>

  );
}
