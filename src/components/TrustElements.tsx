
import React from 'react';

const TrustElements = () => {
  return (
    <section className="py-16 text-center">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl font-bold text-teal-green mb-6">Trusted by Researchers Worldwide</h3>
          <div className="flex justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-5xl font-bold text-salmon">10k+</p>
              <p className="text-teal-green/80">Papers Processed</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-salmon">98%</p>
              <p className="text-teal-green/80">User Satisfaction</p>
            </div>
          </div>
        </div>
        <div className="text-left bg-white p-6 rounded-lg border border-mint shadow-md">
            <p className="italic text-teal-green mb-4">"This tool is a game-changer for my conference preparations. It saves me hours of work and the outlines are incredibly on-point."</p>
            <p className="font-bold text-teal-green">- Dr. Evelyn Reed, Postdoc Researcher</p>
        </div>
      </div>
    </section>
  );
};

export default TrustElements;
