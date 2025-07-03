copied from volto, override with this bit:

      if (Object.keys(action.result).length === 0) {
        return state;
      }

solves problem of crash when the get_content redirects
