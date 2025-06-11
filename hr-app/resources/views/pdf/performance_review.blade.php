<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Performance Review #{{ $review->id }}</title>
  <style>
    body { font-family: sans-serif; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #000; padding: 8px; vertical-align: middle; }
    th { background: #f0f0f0; text-align: left; }
    .center { text-align: center; }
    .no-border { border: none; }
    .signature { margin-top: 40px; }
    .circle { 
      display: inline-block; 
      width: 12px; 
      height: 12px; 
      margin-right: 4px; 
      border-radius: 50%; 
      background: #000; 
    }
    .circle-empty { 
      display: inline-block; 
      width: 12px; 
      height: 12px; 
      margin-right: 4px; 
      border-radius: 50%; 
      border: 1px solid #000; 
    }
      @font-face {
    font-family: 'Meow Script';
    font-style: normal;
    font-weight: normal;
    src: url('{{ public_path('fonts/MeowScript-Regular.ttf') }}') format('truetype');
  }
  .signature-font {
    font-family: 'Meow Script', cursive;
    font-size: 18px;
  }
  </style>
</head>
<body>
  <table>
    <tr>
      <th colspan="4" class="center" style="font-size: 24px;">Performance Review</th>
    </tr>
    <tr>
      <th>Employee</th>
      <td>{{ $review->employee->name }}</td>
      <th>Employee Department</th>
      <td>{{ $review->employee->department->name }}</td>
    </tr>
    <tr>
      <td colspan="4" class="center">
        <img src="{{ $review->employee->image_url }}" 
             alt="Employee Picture" 
             style="width:100px; height:100px; object-fit:cover; border:1px solid #000;">
      </td>
    </tr>
    <tr>
      <th>Reviewer</th>
      <td>{{ $review->reviewer->name }}</td>
      <th>Reviewer Department</th>
      <td>{{ $review->reviewer->department->name }}</td>
    </tr>
    <tr>
      <td colspan="4" class="center">
        <img src="{{ $review->reviewer->image_url }}" 
             alt="Reviewer Picture" 
             style="width:100px; height:100px; object-fit:cover; border:1px solid #000;">
      </td>
    </tr>
    <tr>
      <th>Score</th>
      <td colspan="3">
        @for ($i = 1; $i <= 5; $i++)
          @if ($i <= $review->score)
            <span class="circle"></span>
          @else
            <span class="circle-empty"></span>
          @endif
        @endfor
      </td>
    </tr>
    <tr>
      <th>Feedback</th>
      <td colspan="3">{{ $review->feedback }}</td>
    </tr>
    <tr>
      <td colspan="2">
        <strong>Created at:</strong><br>
        {{ $review->created_at->format('Y-m-d H:i') }}
      </td>
      <td colspan="2">
        <strong>Updated at:</strong><br>
        {{ $review->updated_at->format('Y-m-d H:i') }}
      </td>
    </tr>
   <tr>
  <td class="no-border">
    <img src="{{ public_path('images/hr-logo.png') }}" 
         alt="HR Logo" 
         style="width:80px;">
  </td>
  <td colspan="3" class="no-border">
    <div style="float:right; text-align:center;">
      @php
        // Reviewer signature
        [$revFirst] = explode(' ', $review->reviewer->name);
        $revLastInit = strtoupper(substr(strrchr($review->reviewer->name, ' '), 1, 1));

        // Employee signature
        [$empFirst] = explode(' ', $review->employee->name);
        $empLastInit = strtoupper(substr(strrchr($review->employee->name, ' '), 1, 1));
      @endphp

      _____________________<br>
      <span class="signature-font">{{ $revFirst }} {{ $revLastInit }}.</span><br>
      Reviewer signature<br><br>

      _____________________<br>
      <span class="signature-font">{{ $empFirst }} {{ $empLastInit }}.</span><br>
      Employee signature
    </div>
  </td>
</tr>
  </table>
</body>
</html>
