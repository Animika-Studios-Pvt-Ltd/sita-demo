import { Link } from "react-router-dom";
import "./SitaBreadcrumb.css";

const SitaBreadcrumb = ({ items = [] }) => {
  return (
    <section className="sita-breadcrumb-section">
      {/* <div className="container"> */}
        <div className="row">
          <nav aria-label="breadcrumb" data-aos="fade-up">
            <ol className="breadcrumb">
              {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                  <li
                    key={index}
                    className={`breadcrumb-item ${isLast ? "active" : ""}`}
                    aria-current={isLast ? "page" : undefined}>
                    {isLast || !item.path ? (
                      item.label
                    ) : (
                      <Link to={item.path}>{item.label}</Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      {/* </div> */}
    </section>
  );
};

export default SitaBreadcrumb;
