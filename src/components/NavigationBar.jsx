import React, { useState } from "react";
import RightArrow from '../icons/rightArrow.svg'
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Clock3,
  BarChart2,
  ArrowRightLeftIcon,
  HelpCircleIcon,
  BedDoubleIcon,
} from "lucide-react";

const navLinks = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/"
    },
    {
      name: "Bed Management",
      icon: BedDoubleIcon,
      path: "/bed-management"
    },
    {
      name: "Activity",
      icon: Clock3,
      path: "/activity"
    },
    {
      name: "Help Center",
      icon: HelpCircleIcon,
      path: "/help-center"
    },
  ];

const variants ={
    expanded:{width: "20%"},
    notExpanded:{width:"5%"}
}

function NavigationBar() {
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div 
    animate={isExpanded ? "expanded": "notExpanded"}
    variants= {variants}
     className={
        "py-12 flex flex-col border border-r-r-1 w-1/5 h-screen relative " + 
     (isExpanded ? " px-10" : "px-4")
     }
     >
      <div className="logo-div flex space-x-3 items-center">
        <span className={isExpanded ?"block":"hidden"}>Bed Sync</span>
      </div>

      <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="w-5 h-5 bg-[#FF8C8C] rounded-full absolute-right-[10.5px] top-15 flex items-center justify-center"     
      >
      <img src = {RightArrow} className="w-[6px]" />
      </div>

      <div className="mt-10 flex flex-col space-y-8">
        {navLinks.map((item, index) => (
          <Link to={item.path} key={index}>
            <div
              className={
                "flex space-x-3 p-2 rounded" +
                (activeNavIndex === index
                  ? " bg-[#FF8C8C] text-white font-semibold"
                  : " ")
              }
              onClick={() =>setActiveNavIndex(index)}
            >
              <item.icon />
              <span className={isExpanded ?"block":"hidden"}>{item?.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default NavigationBar;
