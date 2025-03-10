import { BackgroundLines } from "@/components/ui/background-lines";
import { Button, ButtonProps } from "@/components/Button";

export const loginItems = [
  {
    buttonVariant: "primary",
    name: "Start Learning",
    href: "#sign-up",
  },
] satisfies {
  name: string;
  buttonVariant: ButtonProps["variant"];
  href: string;
}[];



export const Hero = () => {
  return <section>
    <div className="container">
      <div className="container">
        <BackgroundLines className="relative flex flex-col items-center justify-center">

          <h1 className="container text-4xl font-semibold text-center leading-tight text-black dark:text-white">
            Level Up your Cyber Skills with AI-driven Training on CybrNinja
            
          </h1>
          <p className="text-center text-lg mt-8 sm:text-base">
            Gamify your learning with AI-powered phishing quizzes, real-time coaching, and interactive challenges. Stay ahead of threats—level up your security skills today!
          </p>
          <div className="flex justify-center mt-10 z-10 mb-10">
            {loginItems.map(({ buttonVariant, name, href }) => (
              <a href={href} key={name}>
                <Button variant={buttonVariant} >{name}</Button>
              </a>

            ))}
        </div>
          
        </BackgroundLines>
        
      </div>

    </div>


  </section>;
};

export default Hero;
