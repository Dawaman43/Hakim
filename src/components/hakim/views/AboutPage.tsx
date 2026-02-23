"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Buildings,
  CellTower,
  Clock,
  HandHeart,
  Heart,
  MapPin,
  Shield,
  Users,
} from "@phosphor-icons/react";

interface AboutPageProps {
  darkMode: boolean;
  t: Record<string, string>;
  navigation: React.ReactNode;
  footer: React.ReactNode;
  cta: React.ReactNode;
}

export function AboutPage({
  darkMode,
  t,
  navigation,
  footer,
  cta,
}: AboutPageProps) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}

      <section className={`pt-8 pb-16 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${darkMode ? "text-foreground" : "text-foreground"}`}>
              {t.aboutTitle}
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                {" "}Hakim
              </span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {t.aboutSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className={`py-24 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? "text-foreground" : "text-foreground"}`}>
                {t.ourMission}
              </h2>
              <p className={`text-lg mb-6 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                {t.missionPara1}
              </p>
              <p className={`text-lg mb-6 ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
                {t.missionPara2}
              </p>
              <div className={`flex items-center gap-4 p-4 rounded-xl ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                <HandHeart size={32} className="text-current" />
                <p className="font-medium text-current">
                  {t.missionBelief}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`rounded-3xl p-8 ${darkMode ? "bg-gradient-to-br from-primary/30 to-primary/30" : "bg-gradient-to-br from-primary to-primary"}`}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, value: "120M+", label: t.populationServed },
                    { icon: Buildings, value: "1,600+", label: "Facilities" },
                    { icon: Clock, value: "2-4 hrs", label: t.avgWaitReduced },
                    { icon: MapPin, value: "13", label: t.regions },
                  ].map((stat, i) => (
                    <div key={i} className={`rounded-2xl p-6 text-center shadow-lg ${darkMode ? "bg-background" : "bg-background"}`}>
                      <stat.icon size={28} className="text-primary mx-auto mb-3" />
                      <p className={`text-2xl font-bold ${darkMode ? "text-foreground" : "text-foreground"}`}>{stat.value}</p>
                      <p className={`text-sm ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={`py-24 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>
              {t.builtForEthiopia}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {t.builtForEthiopiaDesc}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CellTower, title: t.smsFirstDesign, description: t.smsFirstDesignDesc },
              { icon: Brain, title: t.lowBandwidth, description: t.lowBandwidthDesc },
              { icon: MapPin, title: t.regionalCoverage, description: t.regionalCoverageDesc },
              { icon: Shield, title: t.offlineSupport, description: t.offlineSupportDesc },
              { icon: Clock, title: t.availability247, description: t.availability247Desc },
              { icon: Heart, title: t.ethiopianMade, description: t.ethiopianMadeDesc },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow ${darkMode ? "bg-background" : "bg-background"}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${darkMode ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                  <item.icon size={28} className="text-current" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-foreground" : "text-foreground"}`}>{item.title}</h3>
                <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {cta}
      {footer}
    </div>
  );
}
