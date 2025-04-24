"use client";

const TermsContent = (data) => {

  const TermsData = data.data.data;
  const lang = localStorage.getItem('lang') || 'en';


  return (
    <section className="team-info-con">
      <div className="container mx-auto">
        <div className="row flex flex-col md:flex-row ">
          <div className="team-content px-7.5" dangerouslySetInnerHTML={{ __html: lang == 'ta' ? TermsData.description_ta : TermsData.description }}>
          </div>
        </div>
      </div>
    </section>

  );

};

export default TermsContent;