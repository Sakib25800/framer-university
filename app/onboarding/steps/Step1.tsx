import SpeechBubble from '../components/SpeechBubble'

export default function Step1() {
  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className="text-center font-semibold text-white">
        Welcome to<br />Framer University!
      </h1>
      <SpeechBubble message="Please allow me to ask 3 quick questions before we start learning." />
    </div>
  )
}
