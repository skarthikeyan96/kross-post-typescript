const Hero = () => {
  return (
    <section className="body-font text-gray-600 dark:text-white">
      <div
        className="container mx-auto flex flex-col items-center px-5 py-24 md:flex-row"
        style={{ height: `calc(100vh - 168px)` }}
      >
        <div className="dark:text-white mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
          <h1 className="dark:text-white title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
            Cross posting made easy !!!
          </h1>
          <p className="mb-8 leading-relaxed">
            Share your content across Dev.to, Medium and Hashnode with one
            click.
          </p>
        </div>
        <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
          <img
            className="rounded object-cover object-center"
            alt="hero"
            src="https://res.cloudinary.com/dmxhfewt0/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1648731099/undraw_Start_building_re_xani_jbuqg0.png"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
