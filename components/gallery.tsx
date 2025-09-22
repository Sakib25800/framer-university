import React from "react"

// Import all icons
import AdvancedIcon from "@/components/icons/advanced.svg"
import BeginnerIcon from "@/components/icons/beginner.svg"
import BiChevronIcon from "@/components/icons/bi-chevron.svg"
import BrainFilledIcon from "@/components/icons/brain-filled.svg"
import BrainIcon from "@/components/icons/brain.svg"
import BulbIcon from "@/components/icons/bulb.svg"
import CheckmarkIcon from "@/components/icons/checkmark.svg"
import ChevronLeftIcon from "@/components/icons/chevron-left.svg"
import ChevronRightIcon from "@/components/icons/chevron-right.svg"
import CloseIcon from "@/components/icons/close.svg"
import CopyFilledIcon from "@/components/icons/copy-filled.svg"
import CopyIcon from "@/components/icons/copy.svg"
import EyeClosedIcon from "@/components/icons/eye-closed.svg"
import EyeIcon from "@/components/icons/eye.svg"
import HomeFilledIcon from "@/components/icons/home-filled.svg"
import HomeIcon from "@/components/icons/home.svg"
import InfoIcon from "@/components/icons/info.svg"
import IntermediateIcon from "@/components/icons/intermediate.svg"
import LinkIcon from "@/components/icons/link.svg"
import LockFilledIcon from "@/components/icons/lock-filled.svg"
import LockIcon from "@/components/icons/lock.svg"
import Lvl1Icon from "@/components/icons/lvl-1.svg"
import Lvl2Icon from "@/components/icons/lvl-2.svg"
import Lvl3Icon from "@/components/icons/lvl-3.svg"
import Lvl4Icon from "@/components/icons/lvl-4.svg"
import Lvl5Icon from "@/components/icons/lvl-5.svg"
import MessagesIcon from "@/components/icons/messages.svg"
import PlayFilledIcon from "@/components/icons/play-filled.svg"
import PlayIcon from "@/components/icons/play.svg"
import QuestionMarkIcon from "@/components/icons/question-mark.svg"
import SearchIcon from "@/components/icons/search.svg"
import TimeFilledIcon from "@/components/icons/time-filled.svg"
import TimeIcon from "@/components/icons/time.svg"
import TrashFilledIcon from "@/components/icons/trash-filled.svg"
import TrashIcon from "@/components/icons/trash.svg"
import UserFilledIcon from "@/components/icons/user-filled.svg"
import UserIcon from "@/components/icons/user.svg"

export const IconGallery = () => {
  const iconComponents = [
    { name: "Advanced", component: <AdvancedIcon /> },
    { name: "Beginner", component: <BeginnerIcon /> },
    { name: "BiChevron", component: <BiChevronIcon /> },
    { name: "Brain", component: <BrainIcon /> },
    { name: "BrainFilled", component: <BrainFilledIcon /> },
    { name: "Bulb", component: <BulbIcon /> },
    { name: "Checkmark", component: <CheckmarkIcon /> },
    { name: "ChevronLeft", component: <ChevronLeftIcon /> },
    { name: "ChevronRight", component: <ChevronRightIcon /> },
    { name: "Close", component: <CloseIcon /> },
    { name: "Copy", component: <CopyIcon /> },
    { name: "CopyFilled", component: <CopyFilledIcon /> },
    { name: "EyeClosed", component: <EyeClosedIcon /> },
    { name: "Eye", component: <EyeIcon /> },
    { name: "Home", component: <HomeIcon /> },
    { name: "HomeFilled", component: <HomeFilledIcon /> },
    { name: "Info", component: <InfoIcon /> },
    { name: "Intermediate", component: <IntermediateIcon /> },
    { name: "Link", component: <LinkIcon /> },
    { name: "Lock", component: <LockIcon /> },
    { name: "LockFilled", component: <LockFilledIcon /> },
    { name: "Lvl1", component: <Lvl1Icon /> },
    { name: "Lvl2", component: <Lvl2Icon /> },
    { name: "Lvl3", component: <Lvl3Icon /> },
    { name: "Lvl4", component: <Lvl4Icon /> },
    { name: "Lvl5", component: <Lvl5Icon /> },
    { name: "Messages", component: <MessagesIcon /> },
    { name: "Play", component: <PlayIcon /> },
    { name: "PlayFilled", component: <PlayFilledIcon /> },
    { name: "QuestionMark", component: <QuestionMarkIcon /> },
    { name: "Search", component: <SearchIcon /> },
    { name: "Time", component: <TimeIcon /> },
    { name: "TimeFilled", component: <TimeFilledIcon /> },
    { name: "Trash", component: <TrashIcon /> },
    { name: "TrashFilled", component: <TrashFilledIcon /> },
    { name: "User", component: <UserIcon /> },
    { name: "UserFilled", component: <UserFilledIcon /> },
  ]

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Icon Gallery</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {iconComponents.map((icon) => (
          <div
            key={icon.name}
            className="flex flex-col items-center justify-center rounded-md border p-4 hover:bg-gray-50"
          >
            <div className="flex h-8 w-8 items-center justify-center">{icon.component}</div>
            <span className="mt-2 text-center text-sm">{icon.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IconGallery
