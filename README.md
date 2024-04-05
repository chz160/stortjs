# StortJs

StortJs is a super stupid simple, vanilla JavaScript library designed to make HTML table elements sortable with minimal effort. It supports sorting string, numeric, and date columns and can handle tables with multiple header rows. This isn't designed to be the end-all-be-all of sorting libraries, but to be a quick addition to a project that adds sorting to older applications when users inevitable ask for sorting.

## Features

- **Easy to Use**: Simply add a class to your table and let StortJs handle the rest.
- **Flexible**: Supports string, numeric, and date data types.
- **Customizable**: Allows specifying columns that should be sortable.
- **Multiple Tables**: Works with multiple sortable tables on the same page without conflicts.
- **No Dependencies**: Pure vanilla JavaScript, no external libraries required.

## Getting Started

### Installation

Just include StortJs in your HTML before the closing `</body>` tag.

```html
<script src="path/to/stortjs.js"></script>
```

### Usage
1. Mark your table as sortable: Add the sortable class to any table you want to make sortable.

```html
<table class="sortable">
    <thead>
        <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <!-- More columns -->
        </tr>
    </thead>
    <tbody>
        <!-- Table rows -->
    </tbody>
</table>

```

2. (Optional) Specify sortable columns: Add the sortable-column class to any header <th> that should be specifically sortable. If no columns are marked, all columns will be sortable by default.

```html
<th class="sortable-column">Sortable Column</th>
```

3. That's it! StortJs automatically makes your table sortable upon clicking the column headers.

## Customization
StortJs aims to be flexible and easily integrated into your projects. However, if you need to customize the behavior or appearance further:

- Sort Indicators: Customize the sort indicators (e.g., arrows) by styling the :after pseudo-element of the sorted column headers in your CSS.
- Date Formats: The library assumes common date formats. For specific date formats, consider preprocessing your data or extending the library's parsing logic.

## Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

1. Fork it (https://github.com/chz160/stortjs/fork)
2. Create your feature branch (git checkout -b feature/fooBar)
3. Commit your changes (git commit -am 'Add some fooBar')
4. Push to the branch (git push origin feature/fooBar)
5. Create a new Pull Request

## License
StortJs is open-sourced software licensed under the MIT license.