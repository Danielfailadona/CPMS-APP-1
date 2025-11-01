{{-- Universal Popup Component --}}
{{-- Include this in any view where you want to use popups --}}

{{-- CSS --}}
<link rel="stylesheet" href="{{ asset('styles/popup.css') }}">

{{-- JavaScript --}}
<script src="{{ asset('js/popup.js') }}"></script>

{{-- Usage Examples: --}}

{{-- Styled Alert Popups --}}
{{-- showSuccess('User created successfully!'); --}}
{{-- showError('Something went wrong.'); --}}
{{-- showWarning('Please check your input.'); --}}
{{-- showInfo('Information updated.'); --}}

{{-- Generic Popup --}}
{{-- showPopup('Custom Title', 'Custom message'); --}}

{{-- Yes/No Confirmation Popup --}}
{{-- showConfirmPopup('Delete User', 'Are you sure?', --}}
{{--     function() { console.log('YES clicked'); }, --}}
{{--     function() { console.log('NO clicked'); } --}}
{{-- ); --}}

{{-- Advanced Usage: --}}
{{-- window.popup.showSuccess('Success message'); --}}
{{-- window.popup.showError('Error message'); --}}
{{-- window.popup.showWarning('Warning message'); --}}
{{-- window.popup.showInfo('Info message'); --}}