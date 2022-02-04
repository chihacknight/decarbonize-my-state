import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Terminology = () => {
  return (
    <Layout>
      <SEO title="Terminology" />
      <div className="container">
        <h1 className="py-2">Terminology</h1>
        <div className="border-bottom">
          <h3 className="pt-4 pb-2" id="education">Typical education needed</h3>
          <p>Occupations are assigned one of the following eight education levels:</p>
          <ul>
            <li>
              <strong>Doctoral or professional degree. </strong>
              Completion of a doctoral degree (Ph.D.) or professional degree usually requires at least 3 years of full-time academic work beyond a bachelor's degree.
            </li>
            <li>
              <strong>Master's degree. </strong>
              Completion of this degree usually requires 1 or 2 years of full-time academic study beyond a bachelor's degree.
            </li>
            <li>
              <strong>Bachelor's degree. </strong>
              Completion of this degree generally requires at least 4 years, but not more than 5 years, of full-time academic study beyond high school.
            </li>
            <li>
              <strong>Associate's degree. </strong>
              Completion of this degree usually requires at least 2 years but not more than 4 years of full-time academic study beyond high school.
            </li>
            <li>
              <strong>Postsecondary nondegree award. </strong>
              These programs lead to a certificate or other award, but not a degree. The certificate is awarded by the educational institution and is the result of completing formal postsecondary schooling. Certification, issued by a professional organization or certifying body, is not included here. Some postsecondary nondegree award programs last only a few weeks, while others may last 1 to 2 years.
            </li>
            <li>
              <strong>Some college, no degree. </strong>
              This category signifies the achievement of a high school diploma or equivalent plus the completion of one or more postsecondary courses that did not result in a degree or award.
            </li>
            <li>
              <strong>High school diploma or equivalent. </strong>
              This category indicates the completion of high school or an equivalent program resulting in the award of a high school diploma or an equivalent, such as the General Education Development (GED) credential.
            </li>
            <li>
              <strong>No formal educational credential. </strong>
              This category signifies that a formal credential issued by an educational institution, such as a high school diploma or postsecondary certificate, is not typically needed for entry into the occupation.
            </li>
          </ul>
        </div>
        <div className="border-bottom">
          <h3 className="pt-4 pb-2" id="experience">Work experience in a related occupation:</h3>
          <p>Occupations are assigned one of the following three categories:</p>
          <ul>
            <li>
              <strong>5 years or more. </strong>
              This is assigned to occupations if 5 or more years of work experience in a related occupation is typically needed for entry.
            </li>
            <li>
              <strong>Less than 5 years. </strong>
              To enter occupations in this category, workers typically need less than 5 years of work experience in a related occupation.
            </li>
            <li>
              <strong>None. </strong>
              No work experience in a related occupation is typically needed.
            </li>
          </ul>
        </div>
        <div className="border-bottom">
          <h3 className="pt-4 pb-2" id="training">Typical on-the-job training needed to attain competency in the occupation:</h3>
          <p>Training or preparation that is typically needed, once employed in an occupation, to attain competency in the skills needed in that occupation. Training is occupation-specific rather than job-specific; skills learned can be transferred to another job in the same occupation. Occupations are assigned one of the following six training categories:</p>
          <ul>
            <li>
              <strong>Internship/residency. </strong>
              An internship or residency is a formal period of training during which individuals work under the supervision of experienced workers in a professional setting, such as a hospital. Internships and residencies occur after the completion of a formal postsecondary degree program and generally are required for state licensure or certification in fields including medicine, counseling, and architecture. During an internship or residency, trainees may be restricted from independently performing all of the functions of the occupation.
            </li>
            <li>
              <strong>Apprenticeship. </strong>
              An apprenticeship is a formal relationship between a worker and sponsor that consists of a combination of on-the-job training and related occupation-specific technical instruction in which the worker learns the practical and theoretical aspects of an occupation. Apprenticeship programs are sponsored by individual employers, joint employer-and-labor groups, and employer associations. The typical apprenticeship program provides at least 144 hours of occupation-specific technical instruction and 2,000 hours of on-the-job training per year, over a 3- to 5-year period.
            </li>
            <li>
              <strong>Long-term on-the-job training. </strong>
              More than 12 months of on-the-job training or, alternatively, combined work experience and formal classroom instruction. Also included in the long-term on-the-job training category are occupations in which workers typically need to possess a natural ability or talent—including musicians and singers, athletes, dancers, photographers, and actors—and that ability or talent must be cultivated over several years, sometimes in a nonwork setting. This category excludes apprenticeships.
            </li>
            <li>
              <strong>Moderate-term on-the-job training. </strong>
              More than 1 month and up to 12 months of combined on-the-job experience and informal training.
            </li>
            <li>
              <strong>Short-term on-the-job training. </strong>
              One month or less of on-the-job experience and informal training. Training is occupation-specific rather than job-specific; therefore, skills learned can be transferred to another job in the same occupation. This on-the-job training category also includes employer-sponsored training programs. Examples of occupations in the short-term on-the-job training category include retail salespersons and maids and housekeeping cleaners.
            </li>
            <li>
              <strong>None. </strong>
              There is no additional occupation-specific training or preparation typically required to attain competency in the occupation.
            </li>
          </ul>
        </div>
        <small>Source: United States Bureau of Labor Statistics Employment Projections Data Definitions as of September 1 2020.</small>
      </div>
    </Layout>
  )
}

export default Terminology