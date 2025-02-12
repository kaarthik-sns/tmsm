"use client";

import Image from "next/image";

const TermsContent = (data) => {

  const TermsData = data.data.data;
console.log(TermsData);

const offerlist = [
  {
    title: TermsData.feature_one,
    desc: TermsData.feature_one_desc,
  }
  
];

  return (
    <>
    
      <section className="team-info-con">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row ">
           <div className="team-content px-7.5" dangerouslySetInnerHTML={{ __html: TermsData.description }}>
         
            {/* <h3>What Lorem ipsum dolor sit amet,?</h3>
            <p>Sed consectetur pulvinar magna, a sodales sapien ornare ut. Donec semper dapibus metus sed congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate egestas semper. Cras molestie ipsum eget imperdiet porttitor. Suspendisse vel turpis sit amet urna laoreet dignissim. Maecenas in risus at dolor dictum consectetur. Nulla non venenatis libero, quis feugiat enim. Aenean ut tellus lacus. Etiam congue commodo massa, vel maximus purus placerat sed. Fusce venenatis scelerisque consectetur. Sed et maximus felis. </p>
            <h3>What Lorem ipsum dolor sit amet,?</h3>
            <p>Sed consectetur pulvinar magna, a sodales sapien ornare ut. Donec semper dapibus metus sed congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate egestas semper. Cras molestie ipsum eget imperdiet porttitor. Suspendisse vel turpis sit amet urna laoreet dignissim. Maecenas in risus at dolor dictum consectetur. Nulla non venenatis libero, quis feugiat enim. Aenean ut tellus lacus. Etiam congue commodo massa, vel maximus purus placerat sed. Fusce venenatis scelerisque consectetur. Sed et maximus felis. </p>
            */}
           </div>
            
          </div>
        </div>
      </section>


      
    </>
  );
};

export default TermsContent;
