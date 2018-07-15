import React from 'react';

/**
 * Given a string or Array of errors, print them to screen else null
 */
class ListErrors extends React.Component {
  render() {
    const errors = this.props.errors;
    if (errors) {
      // handle arrays of errors
      if (Array.isArray(errors)){
        return (
          <ul className="text-danger">
            {
              Object.keys(errors).map(key => {
                return (
                  <li key={key}>
                    {key} {errors[key]}
                  </li>
                );
              })
            }
          </ul>
        );
      }

      // handle a single string error
      else {
        return (
          <ul className="text-danger">
            <li>
              {errors}
            </li>
          </ul>
        );
      }
    }
    else {
      return null;
    }
  }
}

export default ListErrors;
