interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="">
      <div className="">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-primary text-5xl font-semibold tracking-wide">
            Living Lab
          </p>
          <p className="text-lg font-medium">Sekanak Connect</p>
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-80 text-center text-xs">{subtitle}</p>
    </div>
  );
}
